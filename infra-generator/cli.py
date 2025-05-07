#!/usr/bin/env python3
import argparse
import os
import json
import sys


def generate_terraform(config: dict, output: str):
    # Create a single main.tf that includes all resources
    tf_path = os.path.join(output, "main.tf")
    with open(tf_path, "w") as tf:
        # Provider block
        tf.write('''\
provider "aws" {
  region = "us-east-1"
}

''')
        # Iterate over elements
        for idx, el in enumerate(config.get("elements", [])):
            if el["type"] == "EC2":
                instance_type = el.get("instanceType", "t2.micro")
                tf.write(f'''\
resource "aws_instance" "ec2_{idx}" {{
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "{instance_type}"
  tags = {{
    Name = "{el['label']}"
  }}
}}

''')
            elif el["type"] == "S3":
                enc = el.get("encryptionEnabled", False)
                tf.write(f'''\
resource "aws_s3_bucket" "s3_{idx}" {{
  bucket = "{el['label'].lower()}-{idx}"
  {"server_side_encryption_configuration { rule { apply_server_side_encryption_by_default { sse_algorithm = \"AES256\" } } }" if enc else ""}
}}

''')
            elif el["type"] == "VPC":
                cidr = el.get("cidrBlock", "10.0.0.0/16")
                # VPC resource
                tf.write(f'''\
resource "aws_vpc" "vpc_{idx}" {{
  cidr_block = "{cidr}"
  tags = {{
    Name = "{el['label']}"
  }}
}}

''')
                # Subnet resource
                subnet_cidr = cidr.replace("0.0.0/16", "0.0.0/24")
                tf.write(f'''\
resource "aws_subnet" "subnet_{idx}" {{
  vpc_id            = aws_vpc.vpc_{idx}.id
  cidr_block        = "{subnet_cidr}"
  availability_zone = "us-east-1a"
}}

''')
            elif el["type"] == "Lambda":
                # IAM Role
                role_name = f"{el['label']}_exec_role"
                runtime = el.get("runtime", "python3.9")
                code_path = el.get("codePath", "lambda_code.zip")
                tf.write(f'''\
resource "aws_iam_role" "lambda_role_{idx}" {{
  name = "{role_name}"
  assume_role_policy = <<POLICY
{{
  "Version": "2012-10-17",
  "Statement": [
    {{
      "Action": "sts:AssumeRole",
      "Principal": {{
        "Service": "lambda.amazonaws.com"
      }},
      "Effect": "Allow",
      "Sid": ""
    }}
  ]
}}
POLICY
}}

''')
                # Lambda Function
                tf.write(f'''\
resource "aws_lambda_function" "lambda_{idx}" {{
  function_name    = "{el['label']}"
  role             = aws_iam_role.lambda_role_{idx}.arn
  handler          = "handler.main"
  runtime          = "{runtime}"
  filename         = "{code_path}"
  source_code_hash = filebase64sha256("{code_path}")
}}

''')
        # end for
    print(f"✅ Terraform generated at {tf_path}")


def main():
    parser = argparse.ArgumentParser(description="Generate Terraform from project config")
    parser.add_argument("--config", "-c", required=True,
                        help="Path to JSON file containing project config")
    parser.add_argument("--output", "-o", required=True,
                        help="Directory where Terraform files will be written")
    args = parser.parse_args()

    # Load the config
    try:
        with open(args.config, "r") as f:
            config = json.load(f)
    except Exception as e:
        print(f"❌ Failed to read config: {e}", file=sys.stderr)
        sys.exit(1)

    # Prepare output directory
    os.makedirs(args.output, exist_ok=True)

    # Generate Terraform
    generate_terraform(config, args.output)

if __name__ == "__main__":
    main()
