#ifndef _FALLING_SKY_CONFIG_DATA_test_H_
#define _FALLING_SKY_CONFIG_DATA_test_H_

#include "config/ConfigHolder.h"

struct testConfig
{
    int id; 
    std::string desc; 
    
};

class testConfigHolder : public ConfigHolder<testConfig,int>
{
public:
    testConfigHolder();
    virtual ~testConfigHolder(){}

    virtual int ParseEntity(testConfig& enti,const json::Value jsonEntity);
    virtual int getKey(testConfig& enti){return enti.id;}
};

#endif

