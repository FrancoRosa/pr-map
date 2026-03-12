import { Input } from "./ui/input";

function MovementInput({ title, movement, setMovement }) {
  return (
    <div className="flex items-center gap-2">
      <p className=" capitalize">{title}: </p>
      <Input
        type="range"
        min={-Math.PI}
        max={Math.PI}
        step={0.01}
        onChange={(e) =>
          setMovement((m) => ({ ...m, [title]: parseFloat(e.target.value) }))
        }
        // onChange={(e) => setBoom(parseFloat(e.target.value))}
        name={title}
        value={movement[title]}
      />
    </div>
  );
}

export default MovementInput;
