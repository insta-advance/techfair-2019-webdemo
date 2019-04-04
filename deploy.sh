#!/bin/bash

STAGE=${STAGE:-dev}
REGION=${REGION:-"eu-west-1"}

# 1.  Deploy the infrastructure
cd ./infrastructure

echo "*** Deploying '$STAGE' infrastructure into region '$REGION'..."

# Upload the latest CFN templates to the S3 Bucket
# 1.1  Check if the bucket exists; if not - create one
# 1.2  Sync the files with the bucket, overwrite any older files
BUCKETNAME="techfair2019-$STAGE-cf-templates-$REGION"
EXISTING_BUCKET=`aws s3 ls | grep $BUCKETNAME`
if [ -z "$EXISTING_BUCKET" ]; then
  echo "Bucket '$BUCKETNAME' does not exist. Creating..."
  aws s3 mb s3://$BUCKETNAME --region $REGION
fi

echo "Uploading templates into the '$BUCKETNAME' bucket..."

aws s3 sync . s3://$BUCKETNAME \
  --delete  \
  --exclude "*" \
  --include "*.yaml"

STACKNAME="techfair2019-$STAGE-infrastructure"
TEMPLATE_URL="./template.yaml"

echo "Creating the '$STACKNAME' CloudFormation stack..."

STACKID=$(aws cloudformation deploy \
  --stack-name $STACKNAME \
  --region $REGION \
  --template-file $TEMPLATE_URL)

# 2.  Deploy the CFN stack
cd ../backend

STAGE=$STAGE REGION=$REGION npm run sls-deploy

# 3.  Deploy the Serverless backend
cd ../frontend

echo "Building the frontend..."

# 4.  Build & deploy the frontend

cd 