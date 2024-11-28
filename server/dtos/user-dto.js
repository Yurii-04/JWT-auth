export default class UserDto {
    email;
    id;
    isActivated;
    username;

    constructor(model) {
        this.email = model.email;
        this.id = model.id;
        this.isActivated = model.is_activated;
        this.username = model.username
    }
}