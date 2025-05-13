const axios = require('axios');

module.exports = {
  name: 'guildMemberUpdate',
  async execute(oldMember, newMember) {
    try {
      // 追加されたロールを取得
      const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
      // 削除されたロールを取得
      const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));

      // ロール追加時の処理
      for (const [_, addedRole] of addedRoles) {
        // 子ロールかどうかを確認
        const response = await axios.get(`${process.env.API_BASE_URL}/roles/${addedRole.id}/parents`)
          .then(response => response.data)
          .catch(() => null);

        if (response && response.length > 0) {
          // 親ロールを付与
          const parentRoleId = response[0].roleId;
          try {
            await newMember.roles.add(parentRoleId);
          } catch (error) {
            if (error.code === 50001) {
              console.error(`権限が不足しているため、ロール ${parentRoleId} を付与できませんでした。`);
              // 必要に応じて管理者に通知するなどの処理を追加
            } else {
              throw error;
            }
          }
        }
      }

      // ロール削除時の処理
      for (const [_, removedRole] of removedRoles) {
        // 子ロールかどうかを確認
        const response = await axios.get(`${process.env.API_BASE_URL}/roles/${removedRole.id}/parents`)
          .then(response => response.data)
          .catch(() => null);

        if (response && response.length > 0) {
          const parentRoleId = response[0].roleId;
          // 他の子ロールを持っているかチェック
          const childRolesResponse = await axios.get(`${process.env.API_BASE_URL}/roles/${parentRoleId}/children`)
            .then(response => response.data)
            .catch(() => []);

          const hasOtherChildRoles = childRolesResponse.some(role => 
            role.roleId !== removedRole.id && newMember.roles.cache.has(role.roleId)
          );

          if (!hasOtherChildRoles) {
            try {
              await newMember.roles.remove(parentRoleId);
            } catch (error) {
              if (error.code === 50001) {
                console.error(`権限が不足しているため、ロール ${parentRoleId} を削除できませんでした。`);
                // 必要に応じて管理者に通知するなどの処理を追加
              } else {
                throw error;
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('メンバー更新イベントの処理中にエラーが発生しました:', error);
    }
  },
}; 