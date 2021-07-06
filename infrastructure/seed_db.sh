#!/bin/bash

REGION=${REGION:-"eu-west-1"}

AWS_DEFAULT_REGION=$REGION aws dynamodb batch-write-item --request-items file://db_seed.json