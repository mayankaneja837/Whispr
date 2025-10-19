import * as React from 'react';

interface EmailTemplateProps {
  username:string,
  verifyCode:string
}

export function EmailTemplate({username,verifyCode}:EmailTemplateProps) {
  return (
    <div>
      <h1>Welcome, user {username}!
        Here's your code: {verifyCode}
      </h1>
    </div>
  );
}