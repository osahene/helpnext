export default function Subscriptions() {
  const plans = [
    {
      id: 1,
      label: "Starter",
      title: "Free",
      price: "¢0",
      features: ["Instant text message", "Location sharing"],
      buttonLabel: "Default",
      buttonDisabled: false,
      dependants: "Up to 5 Dependants",
    },
    {
      id: 2,
      label: "Value",
      title: "Pro",
      price: "¢150",
      features: [
        "All of the FREE",
        "Automated voice calls",
        "Connected to related STATE agencies",
      ],
      buttonLabel: "To be added soon",
      buttonDisabled: true,
      dependants: "Up to 10 Dependants",
    },
    {
      id: 3,
      label: "Accelerate",
      title: "Advance",
      price: "¢300",
      features: [
        "All of FREE + PRO",
        "Connected to related PRIVATE agencies",
        "USSD services",
        "Safety insurance packages",
      ],
      buttonLabel: "To be added soon",
      buttonDisabled: true,
      dependants: "Up to 15 Dependants",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-10">
      <div className="text-center">
        <h1 className="text-[#00153B] text-2xl font-semibold mb-2">
          Your Subscription
        </h1>
        <p className="text-[#717F87] text-base font-medium">
          You can subscribe to a subscription plan. All subscriptions are per
          annum.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 w-full max-w-6xl">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white rounded-lg shadow-md border border-gray-200 flex flex-col"
          >
            {/* Plan Header */}
            <div className="p-6">
              <div className="flex justify-end">
                <span className="bg-gray-100 text-[#00153B] text-sm font-bold py-1 px-3 rounded-full">
                  {plan.label}
                </span>
              </div>
              <h2 className="text-[#00153B] text-lg font-bold mt-4">
                {plan.title}
              </h2>
              <p className="text-[#00153B] text-5xl font-bold">{plan.price}</p>
              <p className="text-[#717F87] text-base font-medium mt-2">
                {plan.dependants}
              </p>
            </div>

            {/* Plan Features */}
            <div className="px-6 py-4 flex-grow">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li
                    key={index}
                    className="text-[#717F87] text-sm font-medium"
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Plan Button */}
            <div className="p-6">
              <button
                disabled={plan.buttonDisabled}
                className={`w-full py-3 rounded-md text-white font-semibold ${
                  plan.buttonDisabled
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#006EF5] hover:bg-[#0056c1] transition"
                }`}
              >
                {plan.buttonLabel}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
