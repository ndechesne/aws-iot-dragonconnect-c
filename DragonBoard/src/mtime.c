
#include <sys/time.h>
#include "mtime.h"

long int GetTimeSinceEpoch()
{

	struct timeval tp;
	long int ms;
/*
	gettimeofday(&tp, NULL);
	ms = (tp.tv_sec *1000 + tp.tv_usec /1000);
*/

	return ms;
}
