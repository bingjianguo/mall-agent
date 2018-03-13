process.once('loaded', () => {
  if (typeof module === 'object') {
    // Require Electron, IPC, other modules here
    window.module = module;
    module = undefined;
  }
});

console.log('in preloading');