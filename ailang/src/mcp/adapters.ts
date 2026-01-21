export const MCP = {
  payments: {
    charge: (amount: number) => console.log(`Charging ${amount}`)
  },
  email: {
    send: (to: string, body: string) => console.log(`Email sent to ${to}: ${body}`)
  }
};