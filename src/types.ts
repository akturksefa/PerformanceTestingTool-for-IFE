export interface TestSummary {
  totalRequests: number;
  totalDuration: number;
  avgResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  p95: number;
  errorCount: number;
  errorRate: number;
}

export interface IndividualResult {
  status: number;
  duration: number;
  success: boolean;
  error?: string;
  data?: any;
}

export interface TestResponse {
  summary: TestSummary;
  results: IndividualResult[];
}
