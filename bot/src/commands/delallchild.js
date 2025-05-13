const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('delallchild')
    .setDescription('親ロールの全ての子ロール関係を削除します')
    .addRoleOption(option =>
      option.setName('parentid')
        .setDescription('親ロール')
        .setRequired(true)),

  async execute(interaction) {
    try {
      const parentRole = interaction.options.getRole('parentid');

      // 親ロールの全ての子ロール関係を削除
      await axios.delete(`${process.env.API_BASE_URL}/roles/${parentRole.id}/children`);

      await interaction.reply(`${parentRole.name}の全ての子ロール関係を削除しました。`);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 404) {
        await interaction.reply('指定された親ロールは存在しません。');
      } else {
        await interaction.reply('エラーが発生しました。');
      }
    }
  },
}; 