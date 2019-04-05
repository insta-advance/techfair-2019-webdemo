#!/bin/bash

STAGE=${STAGE:-dev}
REGION=${REGION:-"eu-west-1"}

# 1.  Deploy the infrastructure
cd ./infrastructure

echo "*** Deploying '$STAGE' infrastructure into region '$REGION'..."

STACKNAME="techfair2019-$STAGE-infrastructure"
TEMPLATE_URL="./template.yaml"

echo "Creating the '$STACKNAME' CloudFormation stack..."

STACKID=$(aws cloudformation deploy \
  --stack-name $STACKNAME \
  --region $REGION \
  --template-file $TEMPLATE_URL)

# 2.  Deploy the Serverless stack
cd ../backend

STAGE=$STAGE REGION=$REGION npm run sls-deploy

# 3.  Deploy the Frontend
cd ../frontend

echo "Building the frontend..."

# Retrieve CFN stack output variables needed by the frontend
API_STACKNAME="techfair2019-web-backend-$STAGE"
API_ENDPOINT=$(aws cloudformation describe-stacks --stack-name $API_STACKNAME --region $REGION --output text --query 'Stacks[0].Outputs[?OutputKey==`ServiceEndpoint`].{OutputValue:OutputValue}[0].OutputValue' 2> /dev/null)
FRONTEND_BUCKET=$(aws cloudformation describe-stacks --stack-name $STACKNAME --region $REGION --output text --query 'Stacks[0].Outputs[?OutputKey==`FrontendS3`].{OutputValue:OutputValue}[0].OutputValue' 2> /dev/null)

API_ENDPOINT="$API_ENDPOINT" npm run build

cd ./build

aws s3 sync . s3://$FRONTEND_BUCKET \
  --delete  \
  --include "*"

# 4.  Seed the database
cd ../../infrastructure

DBARN=$(aws cloudformation describe-stacks --stack-name $STACKNAME --region $REGION --output text --query 'Stacks[0].Outputs[?OutputKey==`DynamoDB`].{OutputValue:OutputValue}[0].OutputValue' 2> /dev/null)
DBNAME="$(cut -d'/' -f2 <<<$DBARN)"

sed "2s/.*/\"$DBNAME\":/" db_seed.json > tmp && mv tmp db_seed.json

REGION=$REGION sh seed_db.sh

# 5.  Done!
FRONTEND_BUCKET_ENDPOINT=$(aws cloudformation describe-stacks --stack-name $STACKNAME --region $REGION --output text --query 'Stacks[0].Outputs[?OutputKey==`FrontendS3Endpoint`].{OutputValue:OutputValue}[0].OutputValue' 2> /dev/null)

echo ""
echo ""
echo "Done! App is running at:"
echo ""
echo "$FRONTEND_BUCKET_ENDPOINT"
echo ""
echo ""