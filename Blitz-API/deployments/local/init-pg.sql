CREATE TABLE "account"
(
    "id" INTEGER PRIMARY KEY,
    "number" VARCHAR,
    "name" VARCHAR,
    "type" VARCHAR,
    "apiKey" VARCHAR,
    "secretId" INTEGER
);

CREATE TABLE "secret"
(
    "id" INTEGER PRIMARY KEY,
    "type" VARCHAR,
    "key" VARCHAR
);

-- Birdiescope
INSERT INTO "secret"
VALUES
    (
        1,
        'firebase',
        '4447438feffaaf01d95aa7fe85d7cb2f36d681af6a1d735d54eb5e2dd4c78abfbeefb076afe39eaf0480dcd8e3af52d3bc042009ec5d5ee9419abff9f2fb23341d2d39a22788ebf1c9f0fbdda617d87bd1259dfc7c01218e80d1aaf155e310148360702dfb3b1249a67ab8a3a8246db5cfba3f20921dbbcb0f08e169a32e302cf6e9e310c41b503f2d8de63922db47936631f350579bf7f6c8250687c6bd8e706749288246f885df5f47346b47ac363ec5bd8fcb9cddf70c7d427d2fea797a1a6a7fc7f6168ac0f403c6e9ed3a9d5267d544243a62e4715e28ae7f4be27ab6be251c17492997b5da47995797e1339034b1e391532069bdadd40c0d9ca3b93c48f6e185a8e2ff0b4a52b4aa7c5263e2f4d31925f520ac6a6bc42f98a2bab57283fe82356a6663be775dd113e96ee00ffa90066ea61ad7043992fe32ff067a7258c75cbd275253047f7f36267beb0d884a09a31fdb23a51391bae93300edd5fa73896ef320f4c0435685530174917f28a260bcdad8ec17964e943547e5d0f5391ca7b181367a50c7dcdc14929d6b1f585ea88a4f4507828bd9d09acaebfc340ba311917d305bf8678a3c766f33b21a9bc67eaaf1c1697b600686a2c4cb9df85f256f180a5c318241d760b74436cbe7bb8cb404a2e72fa973c7545efddc1d2e6e66b3efe6836f667b242fe71debb911f17b24defec8f494b61c2ec5b0dedf83b4f8ee4c2ee0613babcaacdf58294ee2dc959a77749613d2ee4ee73c705189347e27e79450b9d70c0e31488a3499f16ab313f2060c0ea6ad22f9e0bd0e181b9780f17fb4b0f233943344551fc71d1445570fb4974765f94ece1de965980583fb1eebf1e5f5ca0a31ace53a9c2a1463e48cb1618caf5c5b3a1d1f35ff4ec093ba33537b6e8b6fe4473c55b45ba2f0f77929d514f6de0f294f99945a82a5eb6486b9edc111682d8a98d636aadb234345b9115e5ec24b34e54118619a9a5491971301a59bf23eaa4711f574978918558d01277e20f59dfefcde5803c4a542b6a2717eae960e8552b93709577a2d1563ff7b486aa01c1daccdc610fc3a3ca8a74bb1272d2e4e9be339acb953ae71785ac0068ba6d10c8ab50bf205a0bc26428b2caa2d7fbc329991e4518decccb6efcffea0b4c5e7dbe79c3abf499aaee499a1a9ea19e341afd5f7d78cd8c2c961d0dbeefba0e72c662d3a8190864bc9b65a28ff34cac2c7313cf3af71c612ef6792dcc644f2253333931bf5662b9ab84e5faf0608ab78156cdf5a73b2ce3b7f6c71851c17896e1bab28728ecf9555ea185b87d7bd135c686b83c37661c2d4adc85b91c2968e56d108807ddcae08576523a7a0ac81ad76887a26bc3321d8e926e96cb5b189ec7c4cf1720db677f0234cc44288ca0dc5db8ea8bd09e2b2c36a68c75f4784e6bade5de21073b8e85988667e91e32fb81a2f07502f9ddee9db390166b6eae3b63134571e5ddea4ecba86ed57da3b8d69ff79ebf0c38a5ba7dee8428faaacdf893c8b972bbf5aeeec2fe6688bb052667700e214f13c4c1467a6678b373ea89aaeccb94b3951b8f3c0a259acba4d9f43cedb7453cfdfeedfd1be768cfd284ee1feff0b673267f613a963356a628930ca23c63a3a9d95b6b69c7d403fd04483a5ef7bebe5885e6dfc965d584793276a2ac279f6df84add25ba9b7e3d8bddde56c6b33035840710303b50b9b495a633fef4bf1076151724dd1d2bb825118e3fba9abe095350372ad0118acf1ace81f63ec6d9ec6db8d4b39b470051b55ca5137896d4dfa9031c2cc2f550dbb11caed8077bb4f77110ed1dcae2a52789f31ad47b03c18a08af385fcc2e91f23069ea53485b36f8a68cdfd6d6e7ef570d24d22abc836686384a01f21acf2513049f3b8c0e340aaac17a7bba4f516c72e2d97cfaa4cabcb4f4b42b9e1ef4df861ae5887da46dc48cfb248d2967b03d2a91626358ba58e678c0752b3d7e115424e5f482cd16f1e277b79204c20e97b32cf92a9e60d209ad7dd7ab13b7f12d9f9e4cc1fa958b7989c2232945236e74dae5df69cbd263f43957a68ef33f82398590eee4baab0604603574bc1b9917157d2f0743f1e4fd63440d1e9a95233a7ae253a8459d87e65af4a064edcb135f1edc4d6b4fb0f00b7f3a043b9148357a031d68087e185e5d464460dccf2cd973d60db545d5bd2a61b152d67c3bbd5dee6d340e20709e168d3ffc19a3f49ac2fb7eacfeeb79e0577b479e2fcd8eafb8ddf82036972c5c4cf23369780851ef9425c2d0af1919cbaf666b6df81f0981efa118e8a56454354f9e067c54f41513df1c7319d611f798bc2cf9eedb41549c8d744fdd768b91196573ab9be8f288a677c0a8427d1ca66a05a4d629d7ca101d04c0af1c0c8d63d785b8fe5caf66187b947eb621e50b056b1a19a880b7421f5161d46f7c2940bb3e5e24b1a576d6b5e6ab61f2a2d16e3b16894c2ac032b3d6d8c486021103420c2783d2cb4691eef0ee9327460cecc64137aabb821aa5dcd45c6282bf231288156ff44a4980feb2f19273fb292ed3c7d5a369624becff843b9775ddfc9a0ca1fba35f6396edf1159bac25ed50f8156bb1cbba754d003536055aca42a8c779e97d8fb07ecb5609eb55c29cb238d32f98e58131582fc3b9da8126f06bbd774618b7600bb21c95f7be1ceb809ab65575b97682b98a358a3a0a9a90a32c7e7af1c938d20858369db1c400db36cabc708581344534975e83dc5019794dd0830f29c5a785beb41271feac6e58921a0ff53025e516e5c9f70e816c27d1300d1d5808831170b1077e58242b592124aacecaeefed5b9b471a14d295aa0671b01100caedccc2f924e31439074569cb87a62295173aedd0f6b3c12e6faa7e37194015f1c888d3690ae0ea43fb7294fdfb5aea16b2222b1a58c10b246c12b2bdd9576e54ce59b74cd963deb4eab2879c5d864448748250eb4a0383a41233cdffae5bf93ae2287f25ccb237549a169bd5d91488dd7c2950ea4b92a5c1800918c6a0084772e6c95e9c04f6893b50eacbfc0f9dc93e60785226acfb2419b77f305b5ab455172fc4401b03e070eaa96158c7c1f3d3abc3660e499734166e1aaf5d14a1f87d49464edad6b6ed09f1a0a42d4cec966481b67c4da083d450a7027c046276c1fbc295d8ea739348fa2106d2cccb538609c642412d4cfa425e0a56d99ab4b29e93b3dc8bddd87a2ef41da9f34f4b86164f9189fed16b33b21191dcc14b385a0c1f69f7767c00065cd005ed04bc54df0c70c7e5d1f7af0d8e25a18425b8d65d14baa43c2b6deec3918c0f380e65a64ac7ab54db6b26f6a1ff358c29ec106f15ba70487f49f64fe364ff94f9071e0432916e2941f08cd470ac53a6dc425be39999d7749e4d864fc47a38fc37f768b81d90e8ceac9b81e59370590e44302a8846831f53c2'
);

INSERT INTO "account"
VALUES
    (
        1,
        'I-1604491582',
        'Birdiescope',
        'Internal',
        'e1db3f9f-9f16-4d8a-9a3b-df1ef88d3e9a',
        1
);

-- Magellan
INSERT INTO "secret"
VALUES
    (
        2,
        'postgres',
        '55e970efc34da4e9b83e796492bbfc547416b6d1ddbedb555e4ac006353a295a50dabdb1ca5afac16891b6ec11353fbf3d1f455ae1e96c7c3a1366ff3f707a12a6b48d8b005eb2faedc65eefa490c2d3608625cf7a647ce0ce19e0f19828e9c64afacc0c26b1e17a9b095564e83845f97f1e3b8ebb562a62ceddab2bc78cdb672a011aebbc7369e8a0233b1e97f5aa20f337b76c618318f2350c3619761a34d0e0ae15285395380d1bfceacde8dc4544d5c80d1b330c1a35a971b93fa7a845e7429310dd69d38ec2a11712'
);

INSERT INTO "account"
VALUES
    (
        2,
        'I-1615106885',
        'Magellan',
        'Internal',
        'bdf04d6a-c911-464b-8916-16cf508d91c4',
        2
);
