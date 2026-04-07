//generate DiceBeer Avatar
//Based on User Name and role

const Avatar = ({ name, role, size = 40 }) => {
  // players get a cartoon human, admins get a robot
  const url = role === "admin" ? getAdminAvatar(name) : getPlayerAvatar(name);

  return (
    <img
      src={url}
      alt={`${name}'s avatar`}
      width={size}
      height={size}
      style={{ borderRadius: "50%", background: "#f0f0f0" }}
    />
  );
};

// ─ Player Avatar ─
const getPlayerAvatar = (name) => {
  const params = new URLSearchParams({
    seed: name,
    scale: "120",
    radius: "50",
    // happy expressions only
    mouth: "default,smile,tongue,twinkle",
    eyebrows: "raisedExcited,raisedExcitedNatural,upDown,upDownNatural",
    // soft background colors
    backgroundColor: "b6e3f4,ffd5dc",
    backgroundType: "gradientLinear",
    backgroundRotation: "-120,-150,130",
  });

  return `https://api.dicebear.com/9.x/avataaars/svg?${params}`;
};

// ─ Admin Avatar ─
const getAdminAvatar = (name) => {
  const params = new URLSearchParams({
    seed: name,
    scale: "120",
    radius: "50",
    // bottts supports color customization
    backgroundColor: "b6e3f4,ffd5dc",
    backgroundType: "gradientLinear",
    backgroundRotation: "-120,-150,130",
  });

  return `https://api.dicebear.com/9.x/bottts/svg?${params}`;
};

export default Avatar;
/* https://api.dicebear.com/9.x/${style}/svg?scale=120&seed=${name} */
