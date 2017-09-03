public class FullPermutation extends Benchmark
{
    private short[] perm;
    private short[] permGradIndex3D;

    void benchmarkCallback()
    {
        long seed = 0;
        perm = new short[256];
        permGradIndex3D = new short[256];
        short[] source = new short[256];
        for (short i = 0; i < 256; i++)
            source[i] = i;
        seed = seed * 6364136223846793005l + 1442695040888963407l;
        seed = seed * 6364136223846793005l + 1442695040888963407l;
        seed = seed * 6364136223846793005l + 1442695040888963407l;
        for (int i = 255; i >= 0; i--) {
            seed = seed * 6364136223846793005l + 1442695040888963407l;
            int r = (int)((seed + 31) % (i + 1));
            if (r < 0)
                r += (i + 1);
            perm[i] = source[r];
            permGradIndex3D[i] = (short)((perm[i] % (gradients3D.length / 3)) * 3);
            source[r] = source[i];
        }
    }

    public static void main(String[] argv)
    throws Exception
    {
        FullPermutation benchmark = new FullPermutation();
        benchmark.run(argv);
    }

    private static byte[] gradients3D = new byte[] {
        -11,  4,  4,     -4,  11,  4,    -4,  4,  11,
         11,  4,  4,      4,  11,  4,     4,  4,  11,
        -11, -4,  4,     -4, -11,  4,    -4, -4,  11,
         11, -4,  4,      4, -11,  4,     4, -4,  11,
        -11,  4, -4,     -4,  11, -4,    -4,  4, -11,
         11,  4, -4,      4,  11, -4,     4,  4, -11,
        -11, -4, -4,     -4, -11, -4,    -4, -4, -11,
         11, -4, -4,      4, -11, -4,     4, -4, -11,
    };
}
