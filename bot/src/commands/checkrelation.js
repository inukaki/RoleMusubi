const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('checkrelation')
    .setDescription('サーバーの全ロールとその関連情報を表示します'),

  async execute(interaction) {
    try {
      const guild = interaction.guild;
      const roles = guild.roles.cache;

      const embed = new EmbedBuilder()
        .setTitle('サーバーのロール関連情報')
        .setColor('#0099ff')
        .setTimestamp();

      let description = '';

      for (const [_, role] of roles) {
        if (role.name === '@everyone') continue;

        // 親ロールの取得
        const parentResponse = await axios.get(`${process.env.API_BASE_URL}/roles/${role.id}/parents`);
        const parentRoles = parentResponse.data;
        
        // 子ロールの取得
        const childResponse = await axios.get(`${process.env.API_BASE_URL}/roles/${role.id}/children`);
        const childRoles = childResponse.data;
        
        // 関係性がある場合のみ表示
        if (parentRoles.length > 0 || childRoles.length > 0) {
          description += `\n**${role.name}**\n`;
          
          if (parentRoles.length > 0) {
            description += '親ロール: ' + parentRoles.map(r => `<@&${r.id}>`).join(', ') + '\n';
          }

          if (childRoles.length > 0) {
            description += '子ロール: ' + childRoles.map(r => `<@&${r.id}>`).join(', ') + '\n';
          }
        }
      }

      if (description === '') {
        description = '関連性のあるロールはありません。';
      }

      embed.setDescription(description);

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply('エラーが発生しました。');
    }
  }
}; 