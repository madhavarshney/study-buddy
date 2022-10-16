# search for partner that is doing the same class as you

def search(que):
    if que:
        found_user = que.top()
        if accept(found_user):
            return found_user
        else:
            # recursively search the next person in q
            search(que[1:])
    else:
        que.add(user)
        continue_searching()