#include "testConfigHolder.h"
#include "common/jansson.hpp"

const char* test_PROTO = "{\"message Entry\":{\"id\":{\"option\":\"required\",\"type\":\"sInt32\",\"tag\":1},\"desc\":{\"option\":\"required\",\"type\":\"string\",\"tag\":2},\"__messages\":{},\"__tags\":{\"1\":\"id\",\"2\":\"desc\"}},\"test\":{\"test\":{\"option\":\"repeated\",\"type\":\"Entry\",\"tag\":1},\"__messages\":{},\"__tags\":{\"1\":\"test\"}}}";

testConfigHolder::testConfigHolder()
    : ConfigHolder<testConfig,int>("test",test_PROTO)
{}

int testConfigHolder::ParseEntity(testConfig& enti,const json::Value jsonEntity) 
{
    enti.id = jsonEntity["id"].as_integer();
    enti.desc = jsonEntity["desc"].as_string();
             
    return 0;
}

