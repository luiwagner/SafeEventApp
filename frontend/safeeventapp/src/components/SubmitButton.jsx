const SubmitButton = ({ text }) => (
  <button
    type="submit"
    className="w-full py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-md shadow-primary/20"
  >
    {text}
  </button>
);