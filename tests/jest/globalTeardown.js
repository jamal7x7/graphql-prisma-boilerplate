module.exports = async () => {
  // Do something to tear the app down
  await global.httpServer.close()
}
