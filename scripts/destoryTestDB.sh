#!/bin/bash
# Script name: destroyTestDB.sh
#
# Empties the collections in reps_development, does not destory the collections
# ex. ./populateTestDB.sh

echo "Destroying database...";
mongo reps_development --eval "db.users.remove({}); db.transactions.remove({}); db.categories.remove({}); db.verificationtokens.remove({});"
exit 0;