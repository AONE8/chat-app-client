const SelectLanguage = () => {
  return (
    <fieldset className="fieldset relative">
      <legend className="fieldset-legend">
        Language <span className="text-red-500">*</span>
      </legend>
      <select name="language" required className="select select-accent">
        <option value="en">English</option>
        <option value="uk">Ukrainian</option>
      </select>
    </fieldset>
  );
};

export default SelectLanguage;
