#remove @ for no make command prints
DEBUG=@

APP_DIR = ./bin
APP_NAME=aws_demo

APP_SRC_FILES += ./src/aws_demo.c
APP_SRC_FILES += ./src/gpio.c
APP_SRC_FILES += ./src/led.c
APP_SRC_FILES += ./src/util.c
APP_SRC_FILES += ./src/mqtt.c
APP_SRC_FILES += ./src/mtime.c
APP_SRC_FILES += ./src/cJSON.c



#IoT client directory
IOT_CLIENT_DIR= ./src/iot_src
IOT_INCLUDE_DIRS += -I $(IOT_CLIENT_DIR)/protocol/mqtt
IOT_INCLUDE_DIRS += -I $(IOT_CLIENT_DIR)/protocol/mqtt/paho_embeddedC
IOT_INCLUDE_DIRS += -I $(IOT_CLIENT_DIR)/protocol/mqtt/paho_embeddedC/platform_linux
IOT_INCLUDE_DIRS += -I $(IOT_CLIENT_DIR)/utils

PLATFORM_DIR = $(IOT_CLIENT_DIR)/protocol/mqtt/paho_embeddedC/platform_linux
IOT_SRC_FILES += $(IOT_CLIENT_DIR)/protocol/mqtt/paho_embeddedC/mqtt_pahoEmbC_wrapper.c
IOT_SRC_FILES += $(shell find $(PLATFORM_DIR)/ -name '*.c')

#MQTT Paho Embedded C client directory
MQTT_DIR = ./src/mqtt_paho_emb
MQTT_C_DIR = $(MQTT_DIR)/MQTTClient-C/src
MQTT_EMB_DIR = $(MQTT_DIR)/MQTTPacket/src

MQTT_INCLUDE_DIR += -I $(MQTT_EMB_DIR)
MQTT_INCLUDE_DIR += -I $(MQTT_C_DIR)

MQTT_SRC_FILES += $(shell find $(MQTT_EMB_DIR)/ -name '*.c')
MQTT_SRC_FILES += $(MQTT_C_DIR)/MQTTClient.c


#TLS - openSSL
TLS_LIB_DIR = /usr/lib/
TLS_INCLUDE_DIR = -I /usr/include/openssl
EXTERNAL_LIBS += -L$(TLS_LIB_DIR)
LD_FLAG += -Wl,-rpath,$(TLS_LIB_DIR)
LD_FLAG += -ldl -lssl -lcrypto -lm

#lib
GLIB_INCLUDE_DIR = -I /usr/include/glib-2.0
#GLIB_INCLUDE_DIR += -I /usr/lib/x86_64-linux-gnu/glib-2.0/include
GLIB_INCLUDE_DIR += -I /usr/lib/aarch64-linux-gnu/glib-2.0/include
LD_FLAG += -lglib-2.0

#Aggregate all include and src directories
INCLUDE_ALL_DIRS += $(IOT_INCLUDE_DIRS) 
INCLUDE_ALL_DIRS += $(MQTT_INCLUDE_DIR) 
INCLUDE_ALL_DIRS += $(TLS_INCLUDE_DIR)
INCLUDE_ALL_DIRS += $(APP_INCLUDE_DIRS)
INCLUDE_ALL_DIRS += $(GLIB_INCLUDE_DIR)
 
SRC_FILES += $(MQTT_SRC_FILES)
SRC_FILES += $(APP_SRC_FILES)
SRC_FILES += $(IOT_SRC_FILES)

# Logging level control
LOG_FLAGS += -DIOT_DEBUG
LOG_FLAGS += -DIOT_INFO
LOG_FLAGS += -DIOT_WARN
LOG_FLAGS += -DIOT_ERROR

COMPILER_FLAGS += -g
COMPILER_FLAGS += $(LOG_FLAGS)

MAKE_CMD = $(CC) $(SRC_FILES) $(COMPILER_FLAGS) -o $(APP_DIR)/$(APP_NAME) $(LD_FLAG) $(EXTERNAL_LIBS) $(INCLUDE_ALL_DIRS)

all:
	$(DEBUG)$(MAKE_CMD)
	
clean:
	rm -rf $(APP_DIR)/$(APP_NAME)	
