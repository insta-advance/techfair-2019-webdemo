#!/bin/bash

aws dynamodb batch-write-item --request-items file://db_seed.json