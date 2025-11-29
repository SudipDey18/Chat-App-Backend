# OTP Generator

![test workflow](https://github.com/rajithaeyee/otp-gen/actions/workflows/test.yml/badge.svg)

Generate secure one-time passwords (OTP) for your applications with ease using this OTP generator package. Whether you need numeric, alphabetic, or special character OTPs, this package has you everything you need. and offers various customization options to generate flexible one-time passwords.

## Installation

Install the package via npm:

```bash
npm install otp-gen-next
```

## Features
Generate numeric, alphabetic, or alphanumeric OTPs
Include uppercase alphabetic characters and special characters if needed
Exclude similar characters like '1' and 'l', '0' and 'O' for enhanced security
Exclude ambiguous characters like '{}' or '[]' that can be confused
Add custom characters to the OTP generation process
Flexible and easy-to-use API

## Playground
[Go to Playground](https://rajithaeyee.github.io/otp-gen/)
![otp-gen-next](https://github.com/user-attachments/assets/63b1f163-aafa-490b-9a15-88f481634e19)


## Usage

### commonJS
```js
const { generateOTP } = require('otp-gen-next')
generateOTP(); //generates a otp with default options with the length of 4
generateOTP(6, { upperCaseAlphabets: false, specialChars: false });

```
### TypeScript
```typescript
import { generateOTP } from 'otp-gen-next';

// Generate a 6-character OTP with custom options
const otp = generateOTP(6, { 
    numeric: true, 
    alphabetic: true, 
    upperCaseAlphabets: true, 
    specialChars: false, 
    excludeSimilarCharacters: true,
    excludeAmbiguousCharacters: true,
    customChars: ''
});

console.log('Generated OTP:', otp);

```
