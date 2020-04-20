<template>
  <div class="cover-background" :class="{'no-webgl': !webgl}">
    <div class="color-overlay view"></div>
    <canvas ref="canvas" :width="width" :height="height"></canvas>
  </div>
</template>

<script>
import fragment from "@/assets/frags/noise.frag";
import vertex from "@/assets/frags/base.vert";
import { supports } from "@/utils";

function Uniform(name, suffix, gl, program) {
  this.name = name;
  this.suffix = suffix;
  this.gl = gl;
  this.location = this.gl.getUniformLocation(program, name);
}

Uniform.prototype.set = function(...values) {
  const method = "uniform" + this.suffix;
  const args = [this.location].concat(values);
  this.gl[method].apply(this.gl, args);
};

function Rect(gl) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, Rect.verts, gl.STATIC_DRAW);
}

Rect.verts = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

Rect.prototype.render = function(gl) {
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};

export default {
  data() {
    return {
      webgl: true,
      gl: null,
      width: window.innerWidth,
      height: window.innerHeight
    };
  },
  mounted() {
    if (!supports.webgl) this.webgl = false;
    if (!this.webgl) return;
    this.mouseX = 0;
    this.mouseY = 0;
    this.startTime = new Date().getTime();
    this.run();
    document.addEventListener("mousemove", event => {
      this.mouseX = event.pageX;
      this.mouseY = event.pageY;
    });
    window.addEventListener("resize", event => this.resize());
  },
  methods: {
    run() {
      const canvas = this.$refs.canvas;
      this.gl = canvas.getContext("webgl");
      if (!this.gl) {
        this.webgl = false;
        return;
      }

      // create program
      this.program = this.gl.createProgram();
      // add shaders
      this.addShader(vertex, this.gl.VERTEX_SHADER);
      this.addShader(fragment, this.gl.FRAGMENT_SHADER);
      // link & use this.program
      this.gl.linkProgram(this.program);
      this.gl.useProgram(this.program);

      // create fragment uniforms
      this.uResolution = new Uniform(
        "u_resolution",
        "2f",
        this.gl,
        this.program
      );
      this.uMouse = new Uniform("u_mouse", "2f", this.gl, this.program);
      this.uTime = new Uniform("u_time", "1f", this.gl, this.program);
      // create position attrib
      this.billboard = new Rect(this.gl);
      const positionLocation = this.gl.getAttribLocation(
        this.program,
        "a_position"
      );
      this.gl.enableVertexAttribArray(positionLocation);
      this.gl.vertexAttribPointer(
        positionLocation,
        2,
        this.gl.FLOAT,
        false,
        0,
        0
      );
      this.resize();
      this.animate();
    },
    addShader(source, type) {
      const shader = this.gl.createShader(type);
      this.gl.shaderSource(shader, source);
      this.gl.compileShader(shader);
      const isCompiled = this.gl.getShaderParameter(
        shader,
        this.gl.COMPILE_STATUS
      );
      if (!isCompiled) {
        throw new Error(
          "Shader compile error: " + this.gl.getShaderInfoLog(shader)
        );
      }
      this.gl.attachShader(this.program, shader);
    },
    animate() {
      // update
      const now = new Date().getTime();
      const currentTime = (now - this.startTime) / 10000;
      this.uTime.set(currentTime);
      this.uMouse.set(this.mouseX, this.mouseY);

      // render
      this.billboard.render(this.gl);
      // animate next frame
      requestAnimationFrame(() => this.animate());
    },
    resize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.uResolution.set(this.width, this.height);
      this.gl.viewport(0, 0, this.width, this.height);
    }
  }
};
</script>

<style lang="scss">
.cover-background {
  width: 100%;
  height: 100%;
  background-color: $col-dark;
  position: relative;
  &.no-webgl {
    background-size: cover;
    .color-overlay.view {
      opacity: 0.5;
    }
  }
}
canvas {
  mix-blend-mode: soft-light;
  opacity: 1;
}
.color-overlay.view {
  background-color: rgba(29, 27, 38, 0.5);
  background-position: left top;
  background-size: 800px;
  animation: shiftbg 1s infinite steps(5);
  z-index: 2;
  opacity: 1;
  @media screen and (max-width: $mqTablet) {
    animation: shiftbg 1s infinite steps(2);
    opacity: 0.15;
  }
}

@supports (mix-blend-mode: multiply) {
  .color-overlay.view {
    opacity: 0.3;
    background-image: url("~@/assets/img/white-noise.jpg");
    mix-blend-mode: multiply;
  }
  .webp .color-overlay.view {
    background-image: url("~@/assets/img/white-noise.webp");
  }
}
</style>
