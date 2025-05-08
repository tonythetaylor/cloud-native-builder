#!/usr/bin/env python3
import argparse
import os
import json
import sys

def generate_terraform(config: dict, output: str):
    tf_path = os.path.join(output, "main.tf")
    with open(tf_path, "w") as tf:
        # Provider block
        tf.write(
            'provider "aws" {\n'
            '  region = "us-east-1"\n'
            '}\n\n'
        )

        for idx, el in enumerate(config.get("elements", [])):
            t = el["type"]
            label = el.get("label", f"resource{idx}")

            if t == "EC2":
                instance_type = el.get("instanceType", "t2.micro")
                tf.write(
                    f'resource "aws_instance" "ec2_{idx}" {{\n'
                    f'  ami           = "ami-0c55b159cbfafe1f0"\n'
                    f'  instance_type = "{instance_type}"\n'
                    f'  tags = {{ Name = "{label}" }}\n'
                    '}\n\n'
                )

            elif t == "S3":
                enc = el.get("encryptionEnabled", False)
                if enc:
                    enc_block = (
                        "  server_side_encryption_configuration {\n"
                        "    rule {\n"
                        "      apply_server_side_encryption_by_default {\n"
                        "        sse_algorithm = \"AES256\"\n"
                        "      }\n"
                        "    }\n"
                        "  }\n"
                    )
                else:
                    enc_block = ""

                tf.write(
                    f'resource "aws_s3_bucket" "s3_{idx}" {{\n'
                    f'  bucket = "{label.lower()}-{idx}"\n'
                    f'{enc_block}'
                    '}\n\n'
                )

            elif t == "VPC":
                cidr = el.get("cidrBlock", "10.0.0.0/16")
                tf.write(
                    f'resource "aws_vpc" "vpc_{idx}" {{\n'
                    f'  cidr_block = "{cidr}"\n'
                    f'  tags = {{ Name = "{label}" }}\n'
                    '}\n\n'
                )
                # derive a /24 subnet from the VPC /16
                subnet_cidr = cidr.replace("/16", "/24")
                tf.write(
                    f'resource "aws_subnet" "subnet_{idx}" {{\n'
                    f'  vpc_id            = aws_vpc.vpc_{idx}.id\n'
                    f'  cidr_block        = "{subnet_cidr}"\n'
                    f'  availability_zone = "us-east-1a"\n'
                    '}\n\n'
                )

            elif t == "Lambda":
                runtime  = el.get("runtime", "python3.9")
                codepath = el.get("codePath", "lambda_code.zip")
                role_name = f"{label}_exec_role"

                # IAM role
                tf.write(
                    f'resource "aws_iam_role" "lambda_role_{idx}" {{\n'
                    f'  name = "{role_name}"\n'
                    '  assume_role_policy = <<POLICY\n'
                    '{\n'
                    '  "Version": "2012-10-17",\n'
                    '  "Statement": [\n'
                    '    {\n'
                    '      "Action": "sts:AssumeRole",\n'
                    '      "Principal": { "Service": "lambda.amazonaws.com" },\n'
                    '      "Effect": "Allow",\n'
                    '      "Sid": ""\n'
                    '    }\n'
                    '  ]\n'
                    '}\n'
                    'POLICY\n'
                    '}\n\n'
                )

                # Lambda function
                tf.write(
                    f'resource "aws_lambda_function" "lambda_{idx}" {{\n'
                    f'  function_name    = "{label}"\n'
                    f'  role             = aws_iam_role.lambda_role_{idx}.arn\n'
                    f'  handler          = "handler.main"\n'
                    f'  runtime          = "{runtime}"\n'
                    f'  filename         = "{codepath}"\n'
                    f'  source_code_hash = filebase64sha256("{codepath}")\n'
                    '}\n\n'
                )

            # add more types here as needed...

    print(f"✅ Terraform generated at {tf_path}")

def main():
    parser = argparse.ArgumentParser(description="Generate Terraform from project config")
    parser.add_argument("-c", "--config", required=True, help="Path to JSON file containing project config")
    parser.add_argument("-o", "--output", required=True, help="Output directory for Terraform files")
    args = parser.parse_args()

    try:
        with open(args.config, "r") as f:
            config = json.load(f)
    except Exception as e:
        print(f"❌ Failed to read config: {e}", file=sys.stderr)
        sys.exit(1)

    os.makedirs(args.output, exist_ok=True)
    generate_terraform(config, args.output)

if __name__ == "__main__":
    main()