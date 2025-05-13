const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addchild')
    .setDescription('親ロールと子ロールの関係を追加します')
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

      await axios.post(`${process.env.API_BASE_URL}/roles/${parentRole.id}/children/${childRole.id}`);
      
      // 子ロールを持つユーザーに親ロールを付与
      const guild = interaction.guild;
      const membersWithChildRole = guild.members.cache.filter(member => 
        member.roles.cache.has(childRole.id)
      );

      for (const [_, member] of membersWithChildRole) {
        if (!member.roles.cache.has(parentRole.id)) {
          await member.roles.add(parentRole);
        }
      }

      await interaction.reply(`${parentRole.name}と${childRole.name}の親子関係を追加しました。`);
    } catch (error) {
      console.error(error);
      await interaction.reply('エラーが発生しました。');
    }
  },
}; 