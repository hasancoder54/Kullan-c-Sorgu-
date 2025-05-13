// pages/api/roblox.js
export default async function handler(req, res) {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({
      error: "Eksik Parametre",
      message: "Lütfen URL'ye '?username=Roblox' gibi bir kullanıcı adı ekleyin."
    });
  }

  try {
    // Roblox kullanıcı bilgilerini almak için API isteği
    const response = await fetch("https://users.roblox.com/v1/usernames/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ usernames: [username], excludeBannedUsers: false })
    });

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return res.status(404).json({
        error: "Kullanıcı Bulunamadı",
        message: `${username} adında bir kullanıcı bulunamadı.`
      });
    }

    const user = data.data[0];
    const userId = user.id;
    const userUsername = user.username;
    const displayName = user.displayName;

    // Kullanıcı detayları
    const userDetailResponse = await fetch(`https://users.roblox.com/v1/users/${userId}`);
    const userDetail = await userDetailResponse.json();

    // Avatar resmi
    const avatarResponse = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=false`);
    const avatarData = await avatarResponse.json();
    const avatarUrl = avatarData.data && avatarData.data.length > 0 ? avatarData.data[0].imageUrl : "Bilinmiyor";

    // API yanıtını JSON olarak döndür
    return res.status(200).json({
      id: userId,
      username: userUsername,
      displayName: displayName,
      created: userDetail.created,
      avatar: avatarUrl
    });

  } catch (error) {
    return res.status(500).json({
      error: "Bilinmeyen Hata",
      message: `Beklenmeyen bir hata oluştu: ${error.message}`
    });
  }
}
