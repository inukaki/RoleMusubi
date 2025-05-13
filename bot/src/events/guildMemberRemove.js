const axios = require('axios');

module.exports = {
  name: 'guildMemberRemove',
  async execute(member) {
    try {
      // ユーザーのロール情報を削除
      await axios.delete(`${process.env.API_BASE_URL}/users/${member.id}`);
    } catch (error) {
      console.error('メンバー退出イベントの処理中にエラーが発生しました:', error);
    }
  },
}; 