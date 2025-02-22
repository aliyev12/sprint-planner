import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { Layout } from "../global/Layout";
import { Alert, CenteredCard } from "../common";

function ErrorPage() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="error-container">
        <h1>{error.status}</h1>
        <h2>{error.statusText}</h2>
        <p>{error.data?.message || "Something went wrong!"}</p>
        <button
          className="waves-effect waves-light btn blue darken-4"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <Layout>
      <CenteredCard>
        <div className="error-container">
          <Alert
            text={(error as Error)?.message || "Unknown error"}
            type="error"
          />
        </div>
      </CenteredCard>
    </Layout>
  );
}

export default ErrorPage;
