import {defineConfig} from 'vite';
export default defineConfig({publicDir:'public',server:{port:4329,strictPort:true},build:{outDir:'dist',emptyOutDir:true}});
