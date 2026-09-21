// Envía una notificación push cuando alguien crea una solicitud de cambio.
//
// El cliente (index.html) escribe un documento ligero en notifyQueue/{id} cada vez que se
// envía una solicitud (además de guardar la solicitud real en el horario del equipo, que no
// se toca desde aquí). Esta función solo reacciona a esos documentos, lee los tokens de
// notificación registrados (guardados por quien pulsó "Activar notificaciones" en su
// dispositivo) y les manda un push. El documento de la cola se borra al terminar.

const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const admin = require('firebase-admin');
admin.initializeApp();

exports.notifyOnChangeRequest = onDocumentCreated('notifyQueue/{id}', async (event) => {
  const snap = event.data;
  if (!snap) return;
  const data = snap.data() || {};

  const tokenDoc = await admin.firestore().collection('teletrabajo').doc('pushTokens').get();
  if (!tokenDoc.exists) { await snap.ref.delete(); return; }

  let tokens = [];
  try { tokens = JSON.parse(tokenDoc.data().value).tokens || []; } catch (e) { tokens = []; }
  if (!tokens.length) { await snap.ref.delete(); return; }

  const message = {
    notification: {
      title: 'Nueva solicitud de cambio',
      body: data.summary || 'Alguien ha pedido un cambio en el teletrabajo.'
    },
    webpush: {
      fcmOptions: { link: 'https://teletrabajo-626b6.web.app/' }
    },
    tokens
  };

  const resp = await admin.messaging().sendEachForMulticast(message);

  // Limpia tokens caducados/inválidos (p.ej. si se desinstaló la app o revocó el permiso)
  // para no volver a intentarlos en el próximo aviso.
  const validTokens = tokens.filter((_, i) => resp.responses[i].success);
  if (validTokens.length !== tokens.length) {
    await admin.firestore().collection('teletrabajo').doc('pushTokens')
      .set({ value: JSON.stringify({ tokens: validTokens }) });
  }

  await snap.ref.delete();
});
