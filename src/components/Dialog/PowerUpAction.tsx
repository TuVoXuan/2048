interface IPowerUpActionProps {
  title: string;
  description: string;
  onCancel: () => void;
}

export default function PowerUpAction({
  title,
  description,
  onCancel,
}: IPowerUpActionProps) {
  return (
    <div className="max-w-80 w-full fixed top-4 left-1/2 -translate-x-1/2 bg-[#524F48] rounded-[14px] px-4 py-3 flex items-center justify-between">
      <div className="space-y-1 shrink-0">
        <h3 className="font-family-rubik font-medium text-sm text-white uppercase">
          {title}
        </h3>
        <p className="font-family-rubik text-sm text-white">{description}</p>
      </div>

      <button
        onClick={onCancel}
        className="rounded-[10px] bg-[#33312b] text-white text-sm h-10 px-4"
      >
        Cancel
      </button>
    </div>
  );
}
