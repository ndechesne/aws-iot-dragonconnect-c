/*
 * gpio.h
 *
 *  Created on: Sep 8, 2015
 *      Author: robert
 */

#ifndef GPIO_H_
#define GPIO_H_

#include <stdlib.h>
#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>
#include <string.h>

int Export_GPIO(int gpio);
int UnExport_GPIO(int gpio);
int Write_GPIO(int gpio, int value);
int Read_GPIO(int gpio, int *value);

#endif /* GPIO_H_ */
