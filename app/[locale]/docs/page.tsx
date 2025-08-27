"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import "./swagger-ui-fix.css";

export default function ApiDocsPage() {
  return <SwaggerUI url="/api/openapi" />;
} 