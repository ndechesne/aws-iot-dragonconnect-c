#include "gpio.h"

#define MAX_BUF 50

int Export_GPIO(int gpio)
{
	int fd;
	char buf[MAX_BUF];

	//Export the specific GPIO36
	//this will create a new folder gpio36
	sprintf(buf, "%d", gpio);
	fd = open("/sys/class/gpio/export", O_WRONLY);
	if(fd < 0)
		return -1;
	write(fd, buf, strlen(buf));
	close(fd);
	return 0;
}

int UnExport_GPIO(int gpio)
{
	int fd;
	char buf[MAX_BUF];

	//UnExport the GPIO
	sprintf(buf, "%d", gpio);
	fd = open("/sys/class/gpio/unexport", O_WRONLY);
	if(fd < 0)
		return -1;
	write(fd, buf, strlen(buf));
	close(fd);
	return 0;
}

int Write_GPIO(int gpio, int value)
{
	int fd;
	char buf[MAX_BUF];

	//Set the direction of the GPIO in folder just created:
	sprintf(buf, "/sys/class/gpio/gpio%d/direction", gpio);
	fd = open(buf, O_WRONLY);
	if(fd<0)
		return -1;
	write(fd, "out", 3);// Set out direction
	close(fd);

	sprintf(buf, "/sys/class/gpio/gpio%d/value", gpio);
	fd = open(buf, O_WRONLY);
	if(fd<0)
		return -1;

	// Write the GPIO value
	sprintf(buf, "%d", value);
	write(fd, buf, strlen(buf));
	close(fd);

	return 0;
}

int Read_GPIO(int gpio, int *value)
{
	int fd;
	char val;
	char buf[MAX_BUF];

	//No need to set direction when reading.
	//Possible to read the state of an output as well

	sprintf(buf, "/sys/class/gpio/gpio%d/value", gpio);
	fd = open(buf, O_RDONLY);
	if(fd<0)
		return -1;

	// Read the GPIO value
	read(fd, &val, 1);
	*value = atoi(&val);
	close(fd);

	return 0;
}

