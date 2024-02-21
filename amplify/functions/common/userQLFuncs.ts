export const createUserQL: string = /* GraphQL */ `
mutation createUser(input:CreateUserInput!)
{
    mutation createUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      cognitoId
      username
      createdAt
    }
  }
}
`;
export const createTeamQL: string = /* GraphQL */ `
mutation createTeam(input:CreateTeamInput!)
{
    mutation createTeam($input: CreateTeamInput!) {
    createUser(input: $input) {
      id
      cognitoId
      username
      createdAt
    }
  }
}
`;
