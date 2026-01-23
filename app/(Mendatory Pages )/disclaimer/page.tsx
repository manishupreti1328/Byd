export default function DisclaimerPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Disclaimer</h1>

      <p className="mb-4">
        The information provided on <strong>bydcarupdates.com</strong> is published in
        good faith and for general informational purposes only.
      </p>

      <p className="mb-4">
        We are not affiliated with BYD or any official automotive organization. Any
        reliance you place on the information found here is strictly at your own risk.
      </p>

      <p>
        If you require more details, please contact us at{" "}
        <a
          href="mailto:support@bydcarupdates.com"
          className="text-blue-600 underline"
        >
          support@bydcarupdates.com
        </a>.
      </p>
    </main>
  );
}
