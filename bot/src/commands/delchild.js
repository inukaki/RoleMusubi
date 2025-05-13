const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('delchild')
    .setDescription('親ロールと子ロールの関係を削除します')
    .addRoleOption(option =>
      option.setName('parentid')
        .setDescription('親ロール')
        .setRequired(true))
    .addRoleOption(option =>
      option.setName('childid')
        .setDescription('子ロール')
        .setRequired(true)),

  async execute(interaction) {
    try {
      const parentRole = interaction.options.getRole('parentid');
      const childRole = interaction.options.getRole('childid');

      // 親子関係の削除
      await axios.delete(`${process.env.API_BASE_URL}/roles/${parentRole.id}/children/${childRole.id}`);

      // 子ロールのみを持つユーザーから親ロールを削除
      const guild = interaction.guild;
      const membersWithChildRole = guild.members.cache.filter(member => 
        member.roles.cache.has(childRole.id)
      );

      for (const [_, member] of membersWithChildRole) {
        if (member.roles.cache.has(parentRole.id)) {
          // 他の子ロールを持っているかチェック
          const hasOtherChildRoles = await axios.get(`${process.env.API_BASE_URL}/roles/${parentRole.id}/children`)
            .then(response => {
              const childRoles = response.data;
              return childRoles.some(role => 
                role.id !== childRole.id && member.roles.cache.has(role.id)
              );
            });

          if (!hasOtherChildRoles) {
            await member.roles.remove(parentRole);
          }
        }
      }

      await interaction.reply(`${parentRole.name}と${childRole.name}の親子関係を削除しました。`);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 404) {
        await interaction.reply('指定された親子関係は存在しません。');
      } else {
        await interaction.reply('エラーが発生しました。');
      }
    }
  },
}; 