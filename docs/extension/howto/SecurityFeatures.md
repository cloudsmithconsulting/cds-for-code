# Security Features in CDS for Code

CloudSmith Consulting takes care to ensure that information collected by CDS for Code remains private and secure.  These 
security and privacy precautions include, but are not limited to:

1. Securing passwords and sensitive information at rest using advanced encryption
1. Securing passwords and sensitive information in transport using advanced encryption
1. Ensuring that passwords and sensitive information cannot be exposed to "screen scrapers" or other similar technologies
1. Ensuring that cryptographic keys are stored and managed independently from encrypted data.

## Encryption for passwords at rest and in transport

CDS for Code leverages 256-bit AES CBC encryption for all sensitive credential information.

1. Information is not decrypted until it isneeded.
1. Information cannot be decrpyted on another machine
1. Information cannot be decrypted through use of the extension's API
1. Encrypted information is never exposed as decrypted information to other extensions through the extension's API

## Secure terminal

1. Password masking
1. Debug output does not show passwords

## Hosted views and content security policies

1. CSP on views to limit URLs

# Privacy features in CDS for Code

## Sensitive logging

1. No credentials or sensitive informatiom appears in logs.
1. PII is excluded in logs, with these exceptions:

  1. Organiation name
  1. Organization URL
  
## Sensitive telemetry

1. PII is excluded from telemetry, with these exceptions (same as above)
1. How to opt out of telemetry (settings)