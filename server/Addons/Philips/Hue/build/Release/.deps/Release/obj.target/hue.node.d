cmd_Release/obj.target/hue.node := flock ./Release/linker.lock g++ -shared -pthread -rdynamic -L../../../src  -Wl,-soname=hue.node -o Release/obj.target/hue.node -Wl,--start-group Release/obj.target/hue/addon.o Release/obj.target/hue/HueWrapper.o -Wl,--end-group 
