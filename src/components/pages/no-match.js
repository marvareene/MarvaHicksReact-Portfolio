import React from 'react';
import {link} from "react-router-dom";

export default function() {
  return (
      <div>
          <h2>We couldnt find this page</h2>
          <link to="/">Return to Homepage</link>
      </div>
  );
}