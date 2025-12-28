const GroupDescriptionSection = ({ description }: { description: string }) => {
  return (
    <section className="chatapp-description-section">
      <p>{description}</p>
    </section>
  );
};

export default GroupDescriptionSection;
