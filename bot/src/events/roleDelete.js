const axios = require('axios');

module.exports = {
  name: 'roleDelete',
  async execute(role) {
    try {
      // 親ロールとしての削除
      await axios.delete(`${process.env.API_BASE_URL}/roles/${role.id}/children`);

      // 子ロールとしての削除
      const parentRole = await axios.get(`${process.env.API_BASE_URL}/roles/${role.id}/parent`)
        .then(response => response.data)
        .catch(() => null);

      if (parentRole) {
        // 親ロールの子ロールを取得
        const remainingChildren = await axios.get(`${process.env.API_BASE_URL}/roles/${parentRole.id}/children`)
          .then(response => response.data)
          .catch(() => []);

        // 子ロールが残っていない場合、親ロールを削除
        if (remainingChildren.length === 0) {
          await role.guild.roles.delete(parentRole.id);
        }
      }
    } catch (error) {
      console.error('ロール削除イベントの処理中にエラーが発生しました:', error);
    }
  },
}; 