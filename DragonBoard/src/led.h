/*
 * led.h
 *
 *  Created on: Sep 8, 2015
 *      Author: robert
 */

#ifndef LED_H_
#define LED_H_

typedef enum UserLed_
{
	UserLED_1,
	UserLED_2,
	UserLED_3,
	UserLED_4,
}UserLed;

typedef enum LED_State_
{
	LED_OFF=0,
	LED_ON
}LED_State;

int GetLEDState(UserLed user_led, LED_State* state);
int SetLEDState(UserLed user_led, LED_State state);
int TurnOn_LED(UserLed user_led);
int TurnOFF_LED(UserLed user_led);
int ToggleLED(UserLed user_led);

#endif /* LED_H_ */
