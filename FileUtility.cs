namespace Microsoft.OpenPublishing.Build.Applications.RedirectionResolver.Utilities
{
    using System.IO;

    internal static class FileUtility
    {
        public static void CreateDirectoryIfNotExist(string filePath)
        {
            var directoryPath = Path.GetDirectoryName(filePath);
            if (!string.IsNullOrEmpty(directoryPath) && !Directory.Exists(directoryPath))
            {
                Directory.CreateDirectory(directoryPath);
            }
        }
    }
}
