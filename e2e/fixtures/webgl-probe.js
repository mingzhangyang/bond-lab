(() => {
  window.__gpu = [];
  const original = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function(type, ...args) {
    const gl = original.call(this, type, ...args);
    if (!gl || !/^webgl/.test(type) || window.__gpu.some(s => s.gl === gl)) return gl;
    const s = {gl, canvas:this, lost:false, counts:{}, shaderErrors:[]};
    window.__gpu.push(s);
    this.addEventListener('webglcontextlost',()=>s.lost=true);
    this.addEventListener('webglcontextrestored',()=>s.lost=false);
    for (const kind of ['Texture','Framebuffer','Renderbuffer','Buffer','Program','Shader']) {
      const live = new Set(); s.counts[kind]=live;
      const create = gl['create'+kind].bind(gl), del = gl['delete'+kind].bind(gl);
      gl['create'+kind]=(...a)=>{const o=create(...a);if(o)live.add(o);return o;};
      gl['delete'+kind]=(o)=>{live.delete(o);return del(o);};
    }
    const link=gl.linkProgram.bind(gl);
    gl.linkProgram=p=>{link(p); if(!gl.getProgramParameter(p,gl.LINK_STATUS))s.shaderErrors.push(gl.getProgramInfoLog(p));};
    return gl;
  };
  window.gpuSnapshot = () => window.__gpu.map(s=>({connected:s.canvas.isConnected,lost:s.lost,counts:Object.fromEntries(Object.entries(s.counts).map(([k,v])=>[k,v.size])),shaderErrors:s.shaderErrors}));
})();
