const axios = require('axios');

module.exports = {
  name: 'guildDelete',
  async execute(guild) {
    try {
      // サーバーに関連するすべてのデータを削除
      await axios.delete(`${process.env.API_BASE_URL}/guilds/${guild.id}/roles`);
    } catch (error) {
      console.error('ボット退出イベントの処理中にエラーが発生しました:', error);
    }
  },
}; 