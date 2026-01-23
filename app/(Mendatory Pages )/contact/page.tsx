export default function ContactPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

      <p className="mb-4">
        Have questions, feedback, or suggestions? We’d love to hear from you.
      </p>

      <div className="rounded-xl border p-4 bg-gray-50">
        <p className="font-medium">Email:</p>
        <a
          href="mailto:support@bydcarupdates.com"
          className="text-blue-600 underline break-all"
        >
          support@bydcarupdates.com
        </a>
      </div>

      <p className="mt-6 text-gray-600">
        We usually respond within 24–48 hours.
      </p>
    </main>
  );
}
