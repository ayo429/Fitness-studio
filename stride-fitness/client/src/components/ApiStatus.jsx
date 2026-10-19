// Shows a loading message or an error with a retry button.
// Renders nothing once the data has arrived.
export default function ApiStatus({ loading, error, slow, retry, what }) {
  if (loading) {
    return (
      <p role="status" className="font-medium text-navy">
        {slow
          ? `Waking up the server… loading ${what} can take a moment.`
          : `Loading ${what}…`}
      </p>
    )
  }

  if (error) {
    return (
      <div role="alert">
        <p className="font-medium text-navy">Couldn’t load {what}. Please try again.</p>
        <button type="button" onClick={retry} className="btn btn-small">
          Try again
        </button>
      </div>
    )
  }

  return null
}
